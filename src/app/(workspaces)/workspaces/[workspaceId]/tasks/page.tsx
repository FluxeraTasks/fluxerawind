interface Params {
  params: {
    workspaceId: string;
  };
}
const WorkspacePage = (paramsPage: Params) => {
  const { params } = paramsPage;

  return <div>Atividades - {params.workspaceId} </div>;
};

export default WorkspacePage;
