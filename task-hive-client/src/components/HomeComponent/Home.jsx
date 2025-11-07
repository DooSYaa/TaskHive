import React from 'react';
import './home.css';
import { 
  Users, 
  CheckCircle, 
  Clock, 
  MessageSquare, 
  BarChart3, 
  ArrowRight,
  Star,
  Columns3,
  Circle
} from 'lucide-react';

export default function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Zarządzaj projektami <span className="highlight">z zespołem</span> — prosto i efektywnie
          </h1>
          <p className="hero-subtitle">
            Platforma, która synchronizuje zadania, komunikację i wyniki. 
            Idealna dla zespołów zdalnych i biurowych.
          </p>
          <div className="hero-actions">
            <button className="btn-primary">
              Rozpocznij za darmo <ArrowRight className="btn-icon" />
            </button>
            <button className="btn-secondary">
              Zobacz demo
            </button>
          </div>
        </div>
        <div className="hero-image">
          <div className="mockup-kanban">
            <div className="kanban-header">
              <h4>Kanban: Projekt "Aplikacja mobilna"</h4>
            </div>
            <div className="kanban-board">
              <div className="kanban-column">
                <div className="column-title">To Do</div>
                <div className="kanban-card">
                  <p>Wireframe ekranu logowania</p>
                  <div className="card-tags">
                    <span className="tag design">UI</span>
                  </div>
                </div>
                <div className="kanban-card">
                  <p>API: endpoint /login</p>
                  <div className="card-tags">
                    <span className="tag backend">BE</span>
                  </div>
                </div>
              </div>
              <div className="kanban-column">
                <div className="column-title">In Progress</div>
                <div className="kanban-card in-progress">
                  <p>Testy integracyjne</p>
                  <div className="card-tags">
                    <span className="tag qa">QA</span>
                  </div>
                </div>
              </div>
              <div className="kanban-column">
                <div className="column-title">Done</div>
                <div className="kanban-card done">
                  <p>Logo finalne</p>
                  <CheckCircle size={14} className="done-icon" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Dlaczego zespoły wybierają nas?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon"><Users /></div>
              <h3>Współpraca w czasie rzeczywistym</h3>
              <p>Komentuj, przypisuj, edytuj — wszystko razem z zespołem, bez opóźnień.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><Columns3 /></div>
              <h3>Kanban, Scrum, Lista</h3>
              <p>Wybierz metodologię, która pasuje do Twojego zespołu.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><MessageSquare /></div>
              <h3>Komunikacja w zadaniach</h3>
              <p>Nie trać wątków — wszystkie dyskusje przy zadaniach, nie w mailach.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="container">
          <h2 className="section-title">Co mówią nasi użytkownicy</h2>
          <div className="testimonials-grid">
            <div className="testimonial">
              <div className="stars">
                {[...Array(5)].map((_, i) => <Star key={i} fill="currentColor" size={18} />)}
              </div>
              <p className="quote">
                „Kanban zmienił sposób, w jaki pracujemy. Wszystko widać jak na dłoni.”
              </p>
              <div className="author">
                <strong>Anna Kowalska</strong>, Product Owner w TechFlow
              </div>
            </div>
            <div className="testimonial">
              <div className="stars">
                {[...Array(5)].map((_, i) => <Star key={i} fill="currentColor" size={18} />)}
              </div>
              <p className="quote">
                „Zespół zdalny działa jak w biurze. Polecam każdemu PM-owi.”
              </p>
              <div className="author">
                <strong>Michał Nowak</strong>, Scrum Master
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="cta-final">
        <div className="container">
          <h2>Gotowy na lepszą współpracę?</h2>
          <p>Załóż konto w 30 sekund i przekonaj się sam.</p>
          <button className="btn-primary large">
            Zacznij teraz — za darmo <ArrowRight className="btn-icon" />
          </button>
          <p className="cta-note">Bez karty. Bez ryzyka. Możesz anulować w każdej chwili.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>© 2025 ProjectFlow. Wszystkie prawa zastrzeżone.</p>
          <div className="footer-links">
            <a href="#">Regulamin</a>
            <a href="#">Polityka prywatności</a>
            <a href="#">Kontakt</a>
          </div>
        </div>
      </footer>
    </div>
  );
}