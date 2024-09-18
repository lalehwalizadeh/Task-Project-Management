import Header from "./Header";
import Footer from "./Footer";
import './Styles/Home.css';
import { Link } from "react-router-dom";

export default function Home() {
	return (
        <div>
            <Header/>
			<h1> Application Title </h1>
			<p>
				There is the Appliction introduction There is the Appliction
				introduction There is the Appliction introduction There is the
				Appliction introduction There is the Appliction introduction There is
				the Appliction introduction There is the Appliction introduction There
				is the Appliction introduction There is the Appliction introduction
				There is the Appliction introduction There is the Appliction
				introduction There is the Appliction introduction There is the
				Appliction introduction There is the Appliction introduction There is
				the Appliction introduction There is the Appliction introduction
			</p>
			<Link to="/SignUp" className=" home-crt-btn regs "> Create Account</Link>
			<Footer />

		</div>
	);
}
