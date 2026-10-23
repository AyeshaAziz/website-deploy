import {
  FALLBACK_COURSES,
  REGISTRATION_SCHEMAS,
  TANZEEM_OPTIONS,
  type CourseDTO,
  type RegistrationTrack,
  type Tanzeem,
} from '@itqa/core';
import {
  createFormConfig,
  formContentSchema,
  type FieldContent,
  type FormConfig,
  type FormContent,
} from '@itqa/core/forms';
import commonJson from '../../content/registration/common.json';
import messagesJson from '../../content/registration/messages.json';
import studentJson from '../../content/registration/student.json';
import teacherJson from '../../content/registration/teacher.json';

interface TrackContentJson {
  title: string;
  description?: string;
  submitLabel: string;
}

interface CommonContentJson {
  fields: Record<string, FieldContent>;
  options?: Record<string, Record<string, string>>;
}

const common: CommonContentJson = commonJson;

const rawContent: Record<RegistrationTrack, TrackContentJson> = {
  teacher: teacherJson,
  student: studentJson,
};

function buildContent(track: RegistrationTrack): FormContent {
  const trackContent = rawContent[track];
  const schema = REGISTRATION_SCHEMAS[track];

  const fields = Object.fromEntries(
    Object.entries(common.fields).filter(([name]) => name in schema.shape),
  );

  return formContentSchema.parse({
    title: trackContent.title,
    description: trackContent.description,
    submitLabel: trackContent.submitLabel,
    fields,
    options: common.options,
    messages: messagesJson,
  });
}

export interface TrackDefinition {
  schema: (typeof REGISTRATION_SCHEMAS)[RegistrationTrack];
  content: FormContent;
}

export const REGISTRATION: Record<RegistrationTrack, TrackDefinition> = {
  teacher: {
    schema: REGISTRATION_SCHEMAS.teacher,
    content: buildContent('teacher'),
  },
  student: {
    schema: REGISTRATION_SCHEMAS.student,
    content: buildContent('student'),
  },
};

export function getTrackDefinition(track: RegistrationTrack): TrackDefinition {
  return REGISTRATION[track];
}

export interface FormConfigOverrides {
  courses?: CourseDTO[];
  tanzeem?: readonly Tanzeem[];
}

export function getFormConfig(
  track: RegistrationTrack,
  { courses, tanzeem = TANZEEM_OPTIONS }: FormConfigOverrides = {},
): FormConfig {
  const definition = getTrackDefinition(track);
  const config = createFormConfig(definition.schema, definition.content);

  const list = courses?.length ? courses : FALLBACK_COURSES;
  const courseOptions = list.map(({ id, title }) => ({ value: id, label: title }));
  const allowedTanzeem = new Set(tanzeem);

  return {
    ...config,
    fields: config.fields.map((field) => {
      if (field.name === 'course') return { ...field, options: courseOptions };
      if (field.name === 'tanzeem') {
        return {
          ...field,
          options: field.options.filter((option) =>
            allowedTanzeem.has(option.value as Tanzeem),
          ),
        };
      }
      return field;
    }),
  };
}
