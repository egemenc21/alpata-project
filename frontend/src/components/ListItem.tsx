
interface ListItemProps {
    title:string
}

function ListItem({title}:ListItemProps) {
  return <span className="w-[150px] overflow-hidden">{title}</span>
}

export default ListItem;