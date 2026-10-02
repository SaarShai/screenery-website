import Configurator from "./Configurator";

export default async function Page(props: PageProps<"/configurator">) {
  const q = await props.searchParams;
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  return <Configurator design={one(q.design)} configId={one(q.c)} />;
}
