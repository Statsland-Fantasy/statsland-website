// CharacterSheet.tsx
import React, { useState } from "react";
import "./CharacterSheet.css";

interface CharacterData {
  name: string;
  age: string;
  position: string;
  bio: string;
  photo?: string;
}

export const CharacterSheet: React.FC = () => {
  const [formData, setFormData] = useState<CharacterData>({
    name: "",
    age: "",
    position: "",
    bio: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Character created:", formData);
  };

  return (
    <div className="desk-surface">
      <form className="character-sheet" onSubmit={handleSubmit}>
        <div className="paper-texture">
          {/* Header Section */}
          <div className="sheet-header">
            <h2 className="stamp-text">CHARACTER DOSSIER</h2>
          </div>

          {/* Main Content Grid */}
          <div className="sheet-content">
            {/* Left Column - Form Fields */}
            <div className="info-column">
              <div className="form-field">
                <label className="typewriter-label">Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="stamped-input"
                  placeholder="Enter name..."
                />
              </div>

              <div className="form-field">
                <label className="typewriter-label">Age:</label>
                <input
                  type="text"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="stamped-input"
                  placeholder="Enter age..."
                />
              </div>

              <div className="form-field">
                <label className="typewriter-label">Position:</label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="stamped-input"
                  placeholder="Enter position..."
                />
              </div>
            </div>

            {/* Right Column - Photo */}
            <div className="photo-column">
              <div className="photo-frame">
                <div className="photo-inner-frame">
                  {formData.photo ? (
                    <img src={formData.photo} alt="Character" />
                  ) : (
                    <div className="photo-placeholder">
                      <span>PHOTO</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="bio-section">
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="bio-textarea"
              placeholder="Character background and story..."
              rows={4}
            />
          </div>

          {/* Status Indicators */}
          <div className="status-row">
            <div className="status-box">
              <span className="status-label">LIVE</span>
              <div className="status-checkbox" />
            </div>
            <div className="status-box">
              <span className="status-label">DECEASED</span>
              <div className="status-checkbox" />
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="stamp-button">
            <span className="skull-icon">💀</span>
            CONFIRM
          </button>
        </div>
      </form>
    </div>
  );
};
