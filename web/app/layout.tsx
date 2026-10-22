import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'Company Tear Sheet | Competitive intelligence',description:'Understand a company, its business model, pricing and competitive landscape, with sources you can inspect.'};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body>{children}</body></html>;}
