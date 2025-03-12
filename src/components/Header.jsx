import { Navbar, Container, Nav } from 'react-bootstrap';
import { QuestionCircleFill } from 'react-bootstrap-icons';

function Header() {
  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand href="#home" className="d-flex align-items-center">
          <QuestionCircleFill size={24} className="me-2" />
          <span className="fw-bold">Golden Valley AI Assistant</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            <Nav.Link 
              href="https://github.com/breakfastmeansbreakfast/chat-gvd" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              GitHub
            </Nav.Link>
            <Nav.Link href="#help">Help</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;