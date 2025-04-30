import checkUser from '@/lib/checkUser'
import {
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
} from '@clerk/nextjs'
// import Image from 'next/image'
import Link from 'next/link'
import { Button } from './ui/button'
import { LayoutDashboard, PenBox } from 'lucide-react'

const Header = async () => {
    await checkUser()

    return (
        <header className='fixed top-0 border-b backdrop-blur-md w-full z-50 bg-white/80'>
            <nav className='container mx-auto py-4 px-8 flex items-center justify-between'>
                <Link href="/">
                    <h1 className='text-2xl font-bold gradient-title '>ExpenseHero</h1>
                    {/* <Image src="" alt='ExpenseHero logo' height={60} width={200} className="h-12 w-auto object-contain"/> */}
                </Link>
                <div className='flex items-center space-x-4'>
                    <SignedIn>
                        <Link href={"/dashboard"}>
                            <Button variant="outline"  className="text-gray-600 hover:text-blue-600 flex items-center gap-2">
                                <LayoutDashboard size={18}/>
                                <span className='hidden md:inline'>Dashboard</span>
                            </Button>
                        </Link>
                        <Link href={"/transaction/create"}>
                        <Button className='flex items-center gap-2'>
                            <PenBox size={18}/>
                            <span className='hidden md:inline'>Add Transaction</span>
                        </Button>
                        </Link>
                        <UserButton appearance={{elements: {avatarBox: "w-10 h-10"}}}/>
                    </SignedIn>
                    <SignedOut>
                        <SignInButton forceRedirectUrl="/dashboard">
                            <Button variant="outline">Login</Button>
                        </SignInButton>
                        <SignUpButton forceRedirectUrl="/signin">
                            <Button className='bg-gradient-to-br from-blue-600 to-purple-600'>SignUp</Button>
                        </SignUpButton>
                    </SignedOut>
                </div>
            </nav>
        </header>
    )
}

export default Header