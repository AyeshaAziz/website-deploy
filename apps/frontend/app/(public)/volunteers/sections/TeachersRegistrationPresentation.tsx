const PRESENTATION_SRC =
  'https://view.officeapps.live.com/op/embed.aspx?src=https%3A%2F%2Fwww%2Eitqa%2Eorg%2Euk%3A443%2Fwp%2Dcontent%2Fuploads%2F2023%2F09%2FITQA%2DTeachers%2DRegistration%2Dupdted%2D1%2Epptx';

export function TeachersPresentation() {
  return (
    <>
      <div className="mx-auto aspect-video w-full max-w-4xl overflow-hidden rounded-card border border-primary-5">
        <iframe
          src={PRESENTATION_SRC}
          title="ITQA Teachers Registration presentation"
          className="h-full w-full"
          allowFullScreen
        />
      </div>
      <h2 className="mt-6 font-heading text-h2 text-primary-neg2">
        ITQA Teachers Registration
      </h2>
      <p className="mt-2 text-body text-neutral-600">
        Presentation covering ITQA courses, enrolment process, and frequently asked questions.
      </p>
    </>
  );
}
