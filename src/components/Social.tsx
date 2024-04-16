import React from 'react'
import Image from 'next/image';
import Link from 'next/link';

const Social: React.FC = () => {
    return (
        <div className="flex w-full bg-transparent justify-end items-center mx-auto">
        <div className="flex flex-row gap-3 items-center">
            <Link href="https://instagram.com" className="flex gap-5 items-center bg-violet-400 hover:bg-violet-600 w-[36px] h-[36px] rounded-full relative justify-center">
                <Image className="items-center" src="/instagram.svg" alt="Instagram" width={16} height={16}/>
            </Link>
            <Link href="https://facebook.com" className="flex gap-5 items-center bg-indigo-400 hover:bg-indigo-600 w-[36px] h-[36px] rounded-full relative justify-center">
                <Image className="items-center" src="/facebook.svg" alt="Facebook" width={16} height={16}/>
            </Link>
            <Link href="https://vkontakte.com" className="flex gap-5 items-center bg-amber-400 hover:bg-amber-600 w-[36px] h-[36px] rounded-full relative justify-center">
                <Image className="items-center" src="/vk.svg" alt="VK" width={16} height={16}/>
            </Link>
            <Link href="https://telegram.org" className="flex gap-5 items-center bg-fuchsia-400 hover:bg-fuchsia-600 w-[36px] h-[36px] rounded-full relative justify-center">
                <Image className="items-center" src="/telegram.svg" alt="Telegram" width={16} height={16}/>
            </Link>
        </div>
      </div>
    );
  };
  
  export default Social;