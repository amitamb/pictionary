// components/DrawingBoard.js
import React from 'react';
import { render } from 'react-dom';
import importKonvaNamed from '../support/importKonvaNamed';
const { Stage, Layer, Line, Text } = importKonvaNamed([ 'Stage', 'Layer', 'Line', 'Text' ]);
import classes from './DrawingBoard.module.scss';
import Button from 'react-bootstrap/Button';
import ToolboxButton from './ToolboxButton';

// const NonSSRButton = dynamic(() => import(Button) from 'react-bootstrap/Button', { ssr: false });

function DrawingBoard({ canDraw, board = {}, onChange }) {

  const [tool, setTool] = React.useState('pen');
  // const [lines, setLines] = React.useState(board?.lines || []);
  let lines = board.lines || [];
  const isDrawing = React.useRef(false);
  const stage = React.useRef();

  const handleMouseDown = (e) => {
    if ( !canDraw ) return;

    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    // setLines([...lines, { tool, points: [pos.x, pos.y] }]);
    onChange([...lines, { tool, points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = (e) => {
    if ( !canDraw ) return;

    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];

    // add point
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    onChange(lines.concat());
  };

  const handleMouseUp = () => {
    if ( !canDraw ) return;

    isDrawing.current = false;
  };

  const handleClear = () => {
    onChange([]);
  };

  const getCursor = () => {
    if ( !canDraw ) return "auto";
    if ( tool == 'pen' ) {
      return "url('/brush.cur'), auto";
    }
    else {
      return "url('/erasor.cur'), auto";
    }
  };

  return (
    <div style={ { cursor: getCursor() } }>
      <Stage
        ref={stage}
        width={730}
        height={547.5}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
      >
        <Layer>
          { canDraw && <Text text="Just start drawing" x={5} y={30} /> }
          {/* { !canDraw && <Text text="Wait for others" x={5} y={30} /> } */}
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke="#010101"
              strokeWidth={10}
              tension={0.5}
              lineCap="round"
              globalCompositeOperation={
                line.tool === 'eraser' ? 'destination-out' : 'source-over'
              }
            />
          ))}
        </Layer>
      </Stage>

      <>
        <Button className="mr-3" onClick={handleClear} disabled={!canDraw} >Clear</Button>
        <ToolboxButton onSelected={setTool} buttonName={'pen'} isSelected={tool == 'pen'} isDisabled={!canDraw}></ToolboxButton>
        <ToolboxButton onSelected={setTool} buttonName={'eraser'} isSelected={tool == 'eraser'} isDisabled={!canDraw} ></ToolboxButton>
      </>
      
    </div>
  );
}

export default DrawingBoard;