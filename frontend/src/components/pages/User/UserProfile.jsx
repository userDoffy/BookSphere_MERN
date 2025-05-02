import React, { useState, useEffect, useRef } from "react";
import { Button, Form } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { getCurrentUser, updateUserProfile } from "../../../axios/userApi.js";
import defaultPic from '../../../assets/default-avatar.jpg';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    profilepic: "",
  });
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null); // ref for hidden file input

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getCurrentUser();
        const { name, email, phone, address, profilepic } = res.data.user;
        setUser(res.data.user);
        setFormData({ name, email, phone, address, profilepic });
        setPreview(profilepic || defaultPic);
      } catch (err) {
        toast.error("Failed to load profile");
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilepic" && files.length) {
      const file = files[0];
      setPreview(URL.createObjectURL(file));
      setFormData((prev) => ({ ...prev, profilepic: file }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    for (let key in formData) {
      payload.append(key, formData[key]);
    }
    try {
      await updateUserProfile(payload);
      toast.success("Profile updated");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="container py-5">
      <div className="row shadow rounded p-4 bg-white">
        {/* Left side: Profile picture */}
        <div className="col-md-4 text-center">
          <div className="mb-3 position-relative">
            <img
              src={preview}
              alt="Profile"
              className="img-thumbnail rounded-circle shadow"
              style={{ width: "150px", height: "150px", objectFit: "cover", cursor: "pointer" }}
              onClick={handleImageClick}
            />
            <input
              type="file"
              name="profilepic"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleChange}
            />
          </div>
          <div className="fw-bold fs-5">
            {formData.name}
            {user?.isAccountVerified && (
              <span className="text-success ms-2" title="Verified">
                <i className="bi bi-patch-check-fill"></i>
              </span>
            )}
          </div>
        </div>

        {/* Right side: User Info */}
        <div className="col-md-8">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label><i className="bi bi-person-fill"></i> Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label><i className="bi bi-envelope-fill"></i> Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label><i className="bi bi-telephone-fill"></i> Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label><i className="bi bi-geo-alt-fill"></i> Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </Form.Group>

            <Button variant="success" type="submit" className="w-100">
              <i className="bi bi-check-circle"></i> Update Profile
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
