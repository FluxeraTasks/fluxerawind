interface Params {
  params: {
    workspaceId: string;
  };
}
const DashboardPage = (paramsPage: Params) => {
  const { params } = paramsPage;

  return <div>Dashboard - {params.workspaceId}</div>;
};

export default DashboardPage;
