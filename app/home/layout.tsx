export default function Layout({ children, modal }: { children: React.ReactNode, modal: React.ReactNode }) {
    return (
        <div className="w-full">
            {modal}
            {children}
        </div>
    )
}