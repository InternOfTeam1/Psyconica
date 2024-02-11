import Image from 'next/image'

const Home: React.FC = () => {
  return (
    <div className="flex justify-center">
      <div className="w-1/2">
        <h1 className="text-center">Welcome to Psyconica!</h1>

        <Image src="/mainPhoto.jpeg" alt="img" width={500} height={500} className="mx-auto block" />
      </div>
    </div>
  );
};

export default Home;