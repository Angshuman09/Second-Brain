const SlugPage = async ({params}: {params: Promise<{id: string, reviewid: string}>}) => {
  const {id} = await params;
  const {reviewid} = await params;
  return (
    <>
    <div>{id}</div>
    <div>{reviewid}</div>
    </>
  )
}

export default SlugPage