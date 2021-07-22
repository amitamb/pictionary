// components/ToolboxButton.js
import classes from './ToolboxButton.module.scss';
import Button from 'react-bootstrap/Button';
import { FaPen, FaEraser } from 'react-icons/fa';

const ButtonIconMap = {
  'pen': FaPen,
  'eraser': FaEraser,
}

function ToolboxButton({ onSelected, buttonName, isSelected }) {

  let ButtonIcon = ButtonIconMap[buttonName];

  return (
    <Button variant={isSelected ? 'dark' : 'light'} className={classes.button} onClick={(e) => {
      onSelected(buttonName);
    }} >
    <ButtonIcon style={{ verticalAlign: 'baseline' }} />
  </Button>
  );
}

export default ToolboxButton;