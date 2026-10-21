import {
  REGISTRATION_SCHEMAS,
  type RegistrationTrack,
} from '@itqa/core';
import {
  createFormConfig,
  formContentSchema,
  type FormConfig,
  type FormContent,
} from '@itqa/core/forms';
import atfalNasiratJson from '../../content/registration/atfal-nasirat.json';
import ansarJson from '../../content/registration/ansar.json';
import khuddamJson from '../../content/registration/khuddam.json';
import lajnaJson from '../../content/registration/lajna.json';
import teacherJson from '../../content/registration/teacher.json';
import messagesJson from '../../content/registration/messages.json';

const rawContent: Record<RegistrationTrack, object> = {
  atfalNasirat: atfalNasiratJson,
  ansar: ansarJson,
  khuddam: khuddamJson,
  lajna: lajnaJson,
  teacher: teacherJson,
};

function buildContent(track: RegistrationTrack): FormContent {
  return formContentSchema.parse({
    ...rawContent[track],
    messages: messagesJson,
  });
}

export interface TrackDefinition {
  schema: (typeof REGISTRATION_SCHEMAS)[RegistrationTrack];
  content: FormContent;
}

export const REGISTRATION: Record<RegistrationTrack, TrackDefinition> = {
  atfalNasirat: {
    schema: REGISTRATION_SCHEMAS.atfalNasirat,
    content: buildContent('atfalNasirat'),
  },
  ansar: {
    schema: REGISTRATION_SCHEMAS.ansar,
    content: buildContent('ansar'),
  },
  khuddam: {
    schema: REGISTRATION_SCHEMAS.khuddam,
    content: buildContent('khuddam'),
  },
  lajna: {
    schema: REGISTRATION_SCHEMAS.lajna,
    content: buildContent('lajna'),
  },
  teacher: {
    schema: REGISTRATION_SCHEMAS.teacher,
    content: buildContent('teacher'),
  },
};

export function getTrackDefinition(track: RegistrationTrack): TrackDefinition {
  return REGISTRATION[track];
}

export function getFormConfig(track: RegistrationTrack): FormConfig {
  const definition = getTrackDefinition(track);
  return createFormConfig(definition.schema, definition.content);
}
