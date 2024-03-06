
interface ListItemProps {
    title:string
}

function ListItem({title}:ListItemProps) {
  return <span className="w-[150px] overflow-hidden text-center">{title}</span>
}

export default ListItem;