interface Params {
  params: {
    workspaceId: string;
  };
}
const TaskPage = (paramsPage: Params) => {
  const { params } = paramsPage;

  return <div>Tasks - {params.workspaceId} </div>;
};

export default TaskPage;
