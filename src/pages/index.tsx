import { GetStaticProps } from 'next'
import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import Image from 'next/image'
import heroImg from '../../public/assets/hero.png'
import { db } from '../services/firebaseConnection'

import {
  collection,
  getDocs,
} from 'firebase/firestore'


interface HomeProps {
  posts: number,
  comments: number
}

export default function Home({comments, posts}: HomeProps) {
  return (
    <div>
      <Head>
        <title>Maizum+ | Organização de tarefas de forma fácil</title>
      </Head>
      <main className={styles.conteiner}>
        <div className={styles.logoContent}>
          <Image
            className={styles.hero}
            alt='Logo Tafera+'
            src={heroImg}
            priority
          />
        </div>
        <h1 className={styles.title}>
          Sistema feito para você organizar <br />
          Suas tarefas
        </h1>

        <div className={styles.infoContent}>
          <section className={styles.box}>
            <span>+ {posts} Tarefas</span>
          </section>
          <section className={styles.box}>
            <span>+ {comments} comentários</span>
          </section>
        </div>
      </main>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {

const commentRef = collection(db, "comments")
const postRef = collection(db, "tarefas")

const commentSnapshot = await getDocs(postRef)
const commentsSnapshot = await getDocs(commentRef)

  return {
    props: {
      posts: commentSnapshot.size || 0,
      comments: commentsSnapshot.size || 0,
      },
      revalidate: 60,
  }
}
