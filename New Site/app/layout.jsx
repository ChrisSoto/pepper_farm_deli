import './globals.css';
import './layout-refresh.css';
import './hero-typography.css';
import {Header,Footer} from '../components/Site';
export const metadata={metadataBase:new URL('https://pepperfarmdeli.com'),title:{default:'Pepper Farm Deli | Sandwiches, Breakfast & Catering in Santee',template:'%s | Pepper Farm Deli'},description:'Your neighborhood deli in Santee. Breakfast burritos, generous sandwiches, fresh salads and catering, made with care since 2020.',robots:{index:true,follow:true},openGraph:{type:'website',siteName:'Pepper Farm Deli',locale:'en_US'}};
export default function Layout({children}){return <html lang="en"><body><a className="skip" href="#main">Skip to content</a><Header/><main id="main">{children}</main><Footer/></body></html>}
