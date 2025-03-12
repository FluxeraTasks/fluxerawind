"use client";
import { ProjectList } from "@/features/projects/components/projects-list";

interface Params {
  params: {
    workspaceId: string;
  };
}
const ProjectsPage = (paramsPage: Params) => {
  const { params } = paramsPage;

  return (
    <div className="w-full h-full justify-center items-center">
      <ProjectList workspaceId={params.workspaceId} />
    </div>
  );
};

export default ProjectsPage;

// const onChange = (evt: string) => {
//   console.log(evt);
// };
{
  /* <Editor
        onChange={onChange}
        // editable={false}
        initialContent={`[{"id":"0ed095c7-746c-40ce-9b0d-d99dbefeff06","type":"paragraph","props":{"textColor":"default","backgroundColor":"default","textAlignment":"left"},"content":[{"type":"text","text":"AB","styles":{}}],"children":[]},{"id":"f5a5e32e-e3cf-4cb5-8aa3-3737611d566a","type":"paragraph","props":{"textColor":"default","backgroundColor":"default","textAlignment":"left"},"content":[],"children":[]}]`}
      /> */
}
