interface BadgeProps {
    color: string;
    children: React.ReactNode;
}

export default function Badge({ color, children }: BadgeProps) {
    return <>
        <div className={` ${color} inline rounded-full px-2 py-1 text-sm`}>
            {children}
        </div>
    </>
}