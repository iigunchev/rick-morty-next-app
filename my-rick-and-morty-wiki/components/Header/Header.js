import React from 'react'
import Link from 'next/link';

export default function Header() {
  return (
    <header>
        <nav>
        <Link href="/">Home</Link>
        <Link href="/episodes">Episodes</Link>
        <Link href="/locations">Locations</Link>
        </nav>
    </header>
  )
}
