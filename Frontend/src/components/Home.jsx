import Footer from './Footer';
import './Styles/Home.css';

import Navbar from './Navbar';

export default function Home() {
	return (
		<>
			<div className='home-layout'>
				<Navbar />

				{/* <div className='home-head'>
					 <Header /> 
				</div> */}
				<div className='home-container'>
					<h3> Task | Paoject Management Web Application </h3>
					<h4> Welcome to Your Ultimate Project Management Solution! </h4>
					<p>
						In today's fast-paced world, effective project management is more
						crucial than ever. Our application is designed to streamline your
						workflow, enhance collaboration, and ensure that no task goes
						unnoticed. Whether you are a freelancer juggling multiple clients, a
						team leader overseeing complex projects, or simply someone looking
						to stay organized, our platform is here to empower you.
					</p>
					<h4>Seamless Task Management</h4>
					<p>
						At the heart of our application lies an intuitive task management
						system. You can easily create, assign, and prioritize tasks with
						just a few clicks. Simply add a new task by entering its title and
						description, setting deadlines, and assigning it to team members.
						With our drag-and-drop interface, you can effortlessly move tasks
						between different stages of completion, ensuring that everyone stays
						on the same page.
					</p>
					<h4>Visualize Your Progress</h4>
					<p>
						Understanding where you stand in a project is essential for
						effective management. Our application offers various visual tools,
						such as Kanban boards and Gantt charts, to help you visualize your
						progress at a glance. You can track the status of each task, monitor
						deadlines, and identify any bottlenecks in your workflow. This way,
						you can make informed decisions and adjust your strategies as
						needed.
					</p>
					<h4>Customizable Workflows</h4>
					<p>
						Every project is unique, and so are your management needs. Our
						application allows you to customize workflows according to your
						preferences. You can create different project templates, set up
						recurring tasks, and define specific stages for each project type.
						This flexibility ensures that you can tailor the application to fit
						your specific requirements.
					</p>
					<h4>Stay Organized with Notifications</h4>
					<p>
						Never miss a deadline again! Our app features a robust notification
						system that keeps you informed about task updates, approaching
						deadlines, and team activities. You can customize your notification
						settings to receive alerts via email or push notifications, ensuring
						that you are always in the loop.
					</p>
					<h4>Analytics and Reporting</h4>
					<p>
						To continuously improve your project management skills, it's
						important to analyze past performance. Our application provides
						insightful analytics and reporting features that allow you to review
						completed projects, assess team productivity, and identify areas for
						improvement. By leveraging this data, you can refine your approach
						and achieve even greater success in future projects.
					</p>
					<h4>Get Started Today!</h4>
					<p>
						Join us in transforming the way you manage projects. With our
						user-friendly interface and powerful features, you'll find it easier
						than ever to keep track of your tasks and collaborate with your
						team. Sign up today and take the first step towards more organized
						and efficient project management!
					</p>
				</div>
			</div>
			{/* <Footer /> */}
		</>
	);
}
