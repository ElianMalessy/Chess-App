import React, { useState } from "react";
import { Card, Button, Alert, Container, Image } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import classes from "./Dashboard.module.css";
import Background from "./Background";

export default function Dashboard() {
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const history = useHistory();

  async function handleLogout() {
    setError("");
    try {
      await logout();
      history.push("/Login");
    } catch {
      setError("Failed to log out");
    }
  }
  function playGame() {
    history.push("/Game");
  }
  return (
    <>
      <div className={classes.background_div}>
        <Background />
      </div>
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <Card
          className="w-100"
          style={{ maxWidth: 500, backgroundColor: "rgb(12, 12, 12)" }}
        >
          <Card.Body style={{ color: "white", position: "relative" }}>
            <h2 className="text-center">Profile</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <ul className="w-100" style={{listStyleType: "none", padding: 10, margin: 0}}>
              <li><strong>Email:</strong> {currentUser && currentUser.email}</li>
              <li><strong>Rating:</strong>1600</li>
            </ul>
            <Image
              src="https://images.chesscomfiles.com/uploads/v1/news/133624.b2e6ae86.668x375o.9d61b2d492ec@2x.jpeg"
              alt="profile-picture"
              style={{
                height: 100,
                width: 100,
                right: 20,
                top: 20,
                position: "absolute",
              }}
              roundedCircle
            />
            <div className="w-100 text-center mt-2">
              <Link to="/update-profile" className="btn btn-primary mt-3">
                Update Profile
              </Link>
              <div>
                <Button onClick={playGame} className=" mt-2">
                  Play a Game With Your Friends
                </Button>
              </div>
              <div>
                <Button variant="link" onClick={handleLogout}>
                  Log Out
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}
