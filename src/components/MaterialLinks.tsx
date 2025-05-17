import React, { useState } from 'react';
"import './MaterialLinks.css';"

interface Material {
  id: number;
  name: string;
  url: string;
}

const MaterialLinks: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [materialName, setMaterialName] = useState('');
  const [materialUrl, setMaterialUrl] = useState('');

  const addMaterial = () => {
    if (materialName.trim() && materialUrl.trim()) {
      setMaterials([
        ...materials,
        {
          id: Date.now(),
          name: materialName,
          url: materialUrl
        }
      ]);
      setMaterialName('');
      setMaterialUrl('');
    }
  };

  const removeMaterial = (id: number) => {
    setMaterials(materials.filter(material => material.id !== id));
  };

  return (
    <div className="material-links">
      <h3>Study Materials</h3>
      <p>Store links to all your study materials in one place</p>

      <div className="add-material">
        <input
          type="text"
          placeholder="Material Name (e.g., Lecture Notes)"
          value={materialName}
          onChange={(e) => setMaterialName(e.target.value)}
        />
        <input
          type="text"
          placeholder="URL (e.g., https://example.com)"
          value={materialUrl}
          onChange={(e) => setMaterialUrl(e.target.value)}
        />
        <button onClick={addMaterial}>Add</button>
      </div>

      <div className="materials-list">
        {materials.length === 0 ? (
          <p className="no-materials">No materials added yet</p>
        ) : (
          <ul>
            {materials.map(material => (
              <li key={material.id}>
                <a href={material.url} target="_blank" rel="noopener noreferrer">
                  {material.name}
                </a>
                <button onClick={() => removeMaterial(material.id)}>Remove</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MaterialLinks;