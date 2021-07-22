// components/ToolboxButton.js
import classes from './ToolboxButton.module.scss';
import Button from 'react-bootstrap/Button';
import { FaPen, FaEraser } from 'react-icons/fa';

const ButtonIconMap = {
  'pen': FaPen,
  'eraser': FaEraser,
}

function ToolboxButton({ onSelected, buttonName, isSelected, isDisabled }) {

  let ButtonIcon = ButtonIconMap[buttonName];

  return (
    <Button variant={isSelected ? 'dark' : 'light'} className={classes.button} onClick={(e) => {
      onSelected(buttonName);
    }} disabled={isDisabled}>
    <ButtonIcon style={{ verticalAlign: 'baseline' }} />
  </Button>
  );
}

export default ToolboxButton;