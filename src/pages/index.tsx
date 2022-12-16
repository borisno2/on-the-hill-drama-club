import React from 'react'
import type {
	NextPage,
} from 'next'
import Head from 'next/head'
import { Container } from 'components/Container'

const Home: NextPage = () => {
	return (
		<div>
			<Head>
				<title>On The Hill Performing Arts</title>
				<meta
					name="description"
					content="On The Hill Performing Arts - Teaching Theatre and Music in the Bendigo Region"
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>


			<Container className="mt-9">
				<section>
					<h1>On the Hill Performing Arts</h1>
					<p>
						At On the Hill Performing Arts, we are passionate about sharing the joy of music and theatre with our students. Our experienced instructors are dedicated to helping each student reach their full potential and achieve their artistic goals.

						We offer a wide range of classes for students of all ages and skill levels, including private music lessons in a variety of instruments, group theatre classes focusing on acting, singing, and dance techniques, and performance opportunities throughout the year. Our welcoming and inclusive community creates a positive and supportive environment for learning and growth.

						Whether you are a seasoned musician looking to fine-tune your skills or a beginner just starting out, we have a class for you. We believe that the arts have the power to enrich lives and bring people together, and we are excited to share this experience with you at On the Hill Performing Arts.
					</p>
				</section>
			</Container>
		</div>
	)
}


export default Home
