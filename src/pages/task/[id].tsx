
import { useState, ChangeEvent, FormEvent } from 'react'
import { useSession } from 'next-auth/react'
import Head from "next/head";
import styles from './style.module.css'
import { GetServerSideProps } from "next";

import { db } from '../../services/firebaseConnection'
import {
    doc,
    collection,
    query,
    where,
    onSnapshot,
    getDoc,
    addDoc,
    getDocs,
    deleteDoc,
} from 'firebase/firestore'
import { Textarea } from "@/src/components/textarea";
import { FaTrash } from 'react-icons/fa'


interface TaskProps {
    item: {
        tarefa: string;
        created: string;
        public: string;
        user: string;
        taskId: string;
    };
    allComments: CommentProps[]
}

interface CommentProps {
    id: string;
    comments: string;
    taskId: string;
    user: string;
    name: string | null | undefined;
}


export default function Task({ item, allComments }: TaskProps) {

    const { data: session } = useSession();

    const [input, setInput] = useState("");
    const [comments, setComments] = useState<CommentProps[]>(allComments || [])

    async function handleComment(event: FormEvent) {
        event.preventDefault();

        if (input === "") return;

        if (!session?.user?.email || !session?.user?.email) return;

        try {
            const docRef = await addDoc(collection(db, "comments"), {
                comments: input,
                created: new Date(),
                user: session?.user?.email,
                name: session?.user?.name,
                taskId: item.taskId
            });

            const data = {
                id: docRef.id,
                comments: input,
                user: session?.user?.email,
                name: session?.user.name,
                taskId: item.taskId,
            }

            setComments((oldItems) => [...oldItems, data])

            setInput("")

        } catch (err) {
            console.log(err)
        }

    }

    async function handleDeleteComment(id:string) {
        try {
            const docRef = doc(db, "comments", id)
            await deleteDoc(docRef)

            const deleteComment = comments.filter((item) => item.id !== id)

            setComments(deleteComment);
            
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div className={styles.conteiner}>
            <Head>
                <title>Detalhes da Tarefas</title>
            </Head>
            <main className={styles.main}>
                <h1>Tarefas</h1>
                <article className={styles.task}>
                    <p>
                        {item.tarefa}
                    </p>
                </article>
            </main>
            <section className={styles.comentsConteiner}>
                <h2>Deixar um comentario</h2>

                <form onSubmit={handleComment}>
                    <Textarea
                        value={input}
                        onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setInput(event.target.value)}
                        placeholder="Digite seu comentario"
                    />
                    <button
                        disabled={!session?.user}
                        className={styles.button}
                    >
                        Enviar comentario
                    </button>
                </form>
            </section>

            <section className={styles.comentsConteiner}>
                <h2>Todos comentários</h2>
                {comments.length === 0 && (
                    <span>Nenhum comentário encontrado...</span>
                )}

                {comments.map((item) => (
                    <article key={item.id} className={styles.comment}>
                        <div className={styles.headComment}>
                            <label className={styles.commentsLabel}>{item.name}</label>
                            {item.user === session?.user?.email && (
                                <button 
                                className={styles.buttonTrash}
                                onClick={ () => handleDeleteComment(item.id)}
                                >
                                    <FaTrash size={18} color='#ea3140' />
                                </button>
                            )}
                        </div>
                        <p>
                            {item.comments}
                        </p>
                    </article>
                ))}
            </section>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const id = params?.id as string;
    const docRef = doc(db, "tarefas", id)

    const q = query(collection(db, "comments"), where("taskId", "==", id))
    const snapshotComments = await getDocs(q)

    let allComments: CommentProps[] = []
    snapshotComments.forEach((doc) => {
        allComments.push({
            id: doc.id,
            comments: doc.data().comments,
            user: doc.data().user,
            name: doc.data().name,
            taskId: doc.data().taskId,
        })

    })

    const snapshot = await getDoc(docRef)

    if (snapshot.data() === undefined) {
        return {
            redirect: {
                destination: '/erro',
                permanent: false
            }
        }
    }

    if (!snapshot.data()?.public) {
        return {
            redirect: {
                destination: '/erro',
                permanent: false
            }
        }
    }

    const miliseconds = snapshot.data()?.created.seconds * 1000;

    const task = {
        tarefa: snapshot.data()?.tarefa,
        public: snapshot.data()?.public,
        created: new Date(miliseconds).toLocaleDateString(),
        user: snapshot.data()?.user,
        taskId: id
    }

    return {
        props: {
            item: task,
            allComments: allComments
        }
    }
}