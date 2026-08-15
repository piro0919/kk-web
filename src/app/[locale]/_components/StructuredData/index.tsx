import { type Thing, type WithContext } from "schema-dts";

type StructuredDataProps = {
  data: WithContext<Thing>;
};

export default function StructuredData({
  data,
}: StructuredDataProps): React.JSX.Element {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
      type="application/ld+json"
    />
  );
}
