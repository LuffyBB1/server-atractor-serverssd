import React, { useState, useRef } from 'react';
import { Stage, Layer, Text, Line } from 'react-konva';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
`;

const Column = styled.div`
  flex: 1;
  padding: 20px;
`;

const Thumbnails = styled.div`
  display: flex;
  margin-top: 10px;
  gap: 10px;
`;

const Thumbnail = styled.div`
  width: 60px;
  height: 60px;
  background-color: #ddd;
  cursor: pointer;
`;

const ConfigSection = styled.div`
  margin-bottom: 20px;
`;

const Button = styled.button`
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  margin-right: 10px;
`;

const Input = styled.input`
  width: 100%;
  padding: 5px;
  margin-bottom: 10px;
`;

const Select = styled.select`
  width: 100%;
  padding: 5px;
  margin-bottom: 10px;
`;

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;

export default function CanvasEditor() {
  const [layers, setLayers] = useState([
    { id: 1, text: 'T', x: 50, y: 50 },
    { id: 2, text: 'Ejemplo', x: 100, y: 100 },
  ]);

  const [selectedLayer, setSelectedLayer] = useState(null);
  const [showGuides, setShowGuides] = useState({ vertical: false, horizontal: false });
  const stageRef = useRef(null);

  const handleDragMove = (e) => {
    const stage = stageRef.current;
    const layer = e.target;
    
    const centerX = CANVAS_WIDTH / 2;
    const centerY = CANVAS_HEIGHT / 2;
    const threshold = 10;

    const newGuides = { vertical: false, horizontal: false };

    if (Math.abs(layer.x() - centerX) < threshold) {
      layer.x(centerX);
      newGuides.vertical = true;
    }

    if (Math.abs(layer.y() - centerY) < threshold) {
      layer.y(centerY);
      newGuides.horizontal = true;
    }

    setShowGuides(newGuides);
  };

  const handleDragEnd = (e, id) => {
    setLayers(
      layers.map((layer) =>
        layer.id === id ? { ...layer, x: e.target.x(), y: e.target.y() } : layer
      )
    );
    setShowGuides({ vertical: false, horizontal: false });
  };

  const handleLayerClick = (id) => {
    setSelectedLayer(id);
  };

  const handleAlignLayer = (alignment) => {
    if (selectedLayer) {
      setLayers(layers.map(layer => 
        layer.id === selectedLayer
          ? { ...layer, x: alignment === 'left' ? 0 : alignment === 'right' ? CANVAS_WIDTH : CANVAS_WIDTH / 2 }
          : layer
      ));
    }
  };

  return (
    <Container>
      <Column>
        <Stage width={CANVAS_WIDTH} height={CANVAS_HEIGHT} ref={stageRef} style={{backgroundColor: "#F2F2F2"}}>
          <Layer>
            {layers.map(layer => (
              <Text
                key={layer.id}
                text={layer.text}
                x={layer.x}
                y={layer.y}
                fontSize={24}
                fill="black"
                draggable
                onDragMove={handleDragMove}
                onDragEnd={(e) => handleDragEnd(e, layer.id)}
                onClick={() => handleLayerClick(layer.id)}
              />
            ))}
            {showGuides.vertical && (
              <Line
                x={CANVAS_WIDTH / 2}
                y={0}
                points={[0, 0, 0, CANVAS_HEIGHT]}
                stroke="red"
                strokeWidth={1}
              />
            )}
            {showGuides.horizontal && (
              <Line
                x={0}
                y={CANVAS_HEIGHT / 2}
                points={[0, 0, CANVAS_WIDTH, 0]}
                stroke="red"
                strokeWidth={1}
              />
            )}
          </Layer>
        </Stage>
        <Thumbnails>
          {[1, 2, 3, 4, 5].map(i => (
            <Thumbnail key={i} />
          ))}
        </Thumbnails>
      </Column>
      <Column>
        <ConfigSection>
          <h3>SVG - TEXTO</h3>
          <Input type="text" placeholder="ESCRIBE UN TEXTO..." />
          <Button>SUBIR ARCHIVO</Button>
        </ConfigSection>
        <ConfigSection>
          <h3>CAPAS</h3>
          <Select>
            {layers.map(layer => (
              <option key={layer.id} value={layer.id}>
                {layer.text}
              </option>
            ))}
          </Select>
          <Button onClick={() => handleAlignLayer('left')}>Alinear Izquierda</Button>
          <Button onClick={() => handleAlignLayer('center')}>Centrar</Button>
          <Button onClick={() => handleAlignLayer('right')}>Alinear Derecha</Button>
        </ConfigSection>
        <ConfigSection>
          <h3>TAMAÑO</h3>
          <Input type="text" placeholder="ANCHO" />
          <Input type="text" placeholder="ALTO" />
        </ConfigSection>
        <ConfigSection>
          <h3>RECORTE</h3>
          <Button>RECTANGULAR</Button>
          <Button>RECTANGULAR CON BORDES</Button>
          <Button>CIRCULAR</Button>
          <Button>SILUETA</Button>
        </ConfigSection>
        <ConfigSection>
          <h3>SOPORTE</h3>
          <Button>SIN SOPORTE</Button>
          <Button>CON TORNILLOS</Button>
          <Button>COLGADO</Button>
          <Button>CON PATAS</Button>
        </ConfigSection>
        <ConfigSection>
          <h3>USO</h3>
          <Button>INTERIOR</Button>
          <Button>EXTERIOR (PROTECCIÓN)</Button>
        </ConfigSection>
        <Button style={{ width: '100%', backgroundColor: '#dc3545' }}>¡Comprar Ya!</Button>
      </Column>
    </Container>
  );
}