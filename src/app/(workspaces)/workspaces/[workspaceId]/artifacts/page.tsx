interface Params {
  params: {
    workspaceId: string;
  };
}
const ArtifactPage = (paramsPage: Params) => {
  const { params } = paramsPage;

  return <div>Artefatos - {params.workspaceId} </div>;
};

export default ArtifactPage;
