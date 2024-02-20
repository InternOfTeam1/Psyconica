import React from 'react'
import Image from 'next/image';
import Link from 'next/link';

const Social: React.FC = () => {
    return (
      <div className="fixed top-[80px] left-0 z-[40] w-full h-[100px] hg-transparent flex justify-end items-center px-10 md:px-20">
        <div className="flex flex-row gap-5 items-center">
            <Link href="https://instagram.com" className="flex gap-5 items-center bg-neutral-600 w-[45px] h-[45px] rounded-full relative justify-center">
                <Image className="items-center" src="/instagram.svg" alt="Instagram" width={28} height={28}/>
            </Link>
            <Link href="https://facebook.com" className="flex gap-5 items-center bg-neutral-600 w-[45px] h-[45px] rounded-full relative justify-center">
                <Image className="items-center" src="/facebook.svg" alt="Facebook" width={28} height={28}/>
            </Link>
            <Link href="https://vkontakte.com" className="flex gap-5 items-center bg-neutral-600 w-[45px] h-[45px] rounded-full relative justify-center">
                <Image className="items-center" src="/vk.svg" alt="VK" width={28} height={28}/>
            </Link>
            <Link href="https://telegram.org" className="flex gap-5 items-center bg-neutral-600 w-[45px] h-[45px] rounded-full relative justify-center">
                <Image className="items-center" src="/telegram.svg" alt="Telegram" width={28} height={28}/>
            </Link>
        </div>
      </div>
    );
  };
  
  export default Social;