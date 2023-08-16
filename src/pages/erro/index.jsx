import Link from "next/link";


export default function PageErro() {
    return (
        <div>
            <div>
                <h1>Essa tarefa foi apagada, não é publica ou nunca existiu</h1>
            </div>
            <div>
                <Link href='/dashboard'>
                Voltar para inicio
                </Link>
            </div>
        </div>
    )
}