import Head from 'next/head';

interface MetaDataProps {
  title: string;
  description: string;
}

const MetaData: React.FC<MetaDataProps> = ({ title, description }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Head>
  );
};

export default MetaData;
