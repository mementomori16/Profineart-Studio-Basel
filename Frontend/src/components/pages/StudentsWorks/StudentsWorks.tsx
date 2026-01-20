import React, { useState, useEffect } from 'react';
import StudentArtwork from '../ArtworkByStudent/StudentArtwork'; 
import './studentsWorks.scss';

const StudentsWorks: React.FC = () => {
    const [hours, setHours] = useState(10);

    useEffect(() => {
        // Deep Dark background for the whole page life
        document.body.style.backgroundColor = '#121212'; 
        return () => { document.body.style.backgroundColor = ''; };
    }, []);

    return (
        <div className="students-gallery-root">
            <div className="container">
                
                {/* HERO: Working Progress Text vs Artwork Illustration */}
                <section className="featured-hero">
                    <div className="hero-text">
                        <span className="label">The Academic Process</span>
                        <h2>Technical Evolution</h2>
                        <div className="progress-essay">
                            <p>
                                True mastery in the studio is not about the final image, but the 
                                <strong> technical rigor</strong> maintained throughout the working process. 
                                Our curriculum focuses on the biological 'eye-brain-hand' coordination, 
                                ensuring that every stroke is a deliberate decision based on light-theory 
                                and anatomical structure.
                            </p>
                        </div>
                    </div>

                    <div className="hero-image-container">
                        <img 
                            src="https://i.ibb.co/wrN5n3xP/DSC-8287-500kb.jpg" 
                            alt="Student Progress Illustration" 
                            className="premium-frame"
                        />
                        <div className="artwork-caption">
                            <span className="art-title">Commando Divers Study</span>
                            <span className="student-info">Shay R., Born 1965</span>
                        </div>
                    </div>
                </section>

                {/* TIMELINE CALCULATOR */}
                <section className="timeline-calculator">
                    <h3>Commitment to Mastery</h3>
                    <p>Determine your pace through the 320-hour professional curriculum.</p>
                    <input 
                        type="range" min="4" max="40" 
                        value={hours} 
                        onChange={(e) => setHours(parseInt(e.target.value))} 
                    />
                    <div className="hours-display">{hours} Hours / Week</div>
                    <div className="results-wrap">
                        <div className="res-item">
                            <span>Foundations</span>
                            <strong>{Math.round(80 / hours)} Weeks</strong>
                        </div>
                        <div className="res-item">
                            <span>Full Graduation</span>
                            <strong>{Math.round(320 / hours)} Weeks</strong>
                        </div>
                    </div>
                </section>

                {/* THE MAIN CAROUSEL */}
                <StudentArtwork />

                {/* PILLARS (Misleading icons replaced with Curriculum Focus) */}
                <section className="curriculum-pillars">
                    <div className="pillar-item">
                        <div className="pillar-icon">◈</div>
                        <h5>Ancient Technique</h5>
                        <p>Mastery of Egg Tempera and 24k Gold Gilding.</p>
                    </div>
                    <div className="pillar-item">
                        <div className="pillar-icon">◈</div>
                        <h5>Material Science</h5>
                        <p>In-depth study of linen weights and pigment chemistry.</p>
                    </div>
                    <div className="pillar-item">
                        <div className="pillar-icon">◈</div>
                        <h5>Anatomical Logic</h5>
                        <p>Freehand drawing without mechanical assistance.</p>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default StudentsWorks;