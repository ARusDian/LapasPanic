import {
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { RegisterProps, Role } from "../../../types/Auth.type";
import { api, getAllRoles } from "../../../utils/api";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { ErrorData } from "../../../types/error.type";

interface Props {
  onSubmit?: (e: React.FormEvent<HTMLFormElement>, data: RegisterProps) => void;
  data?: RegisterProps;
}

const UserForm = ({ onSubmit, data }: Props) => {
  const [form, setForm] = React.useState<RegisterProps>(
    data ?? {
      name: "",
      email: "",
      NIP: "",
      gender: "L",
      jabatan: "",
      roleId: 5,
      password: "",
      confirm_password: "",
      approved: true,
    }
  );
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [error, setError] = useState<ErrorData>({
    type: null,
    details: null,
  });

  const formSubmitHandler = (
    e: React.FormEvent<HTMLFormElement>,
    data: RegisterProps
  ) => {
    e.preventDefault();
    api
      .post("/users", data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((res) => {
        console.log(res);
        navigate("/dashboard/users");
      })
      .catch((err) => {
        if (err.response.status === 400) {
          setError({
            type: "email",
            details: err.response.data.error.details,
          });
        }
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const jabatanSelectHandler = (event: SelectChangeEvent) => {
    setForm((prev) => ({
      ...prev,
      jabatan: event.target.value,
    }));
  };

  const genderSelectHandler = (event: SelectChangeEvent) => {
    setForm((prev) => ({
      ...prev,
      gender: event.target.value as "L" | "P",
    }));
  };

  const formSetHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    getAllRoles().then((res) => {
      setRoles(res);
      setIsLoading(false);
    });
  }, []);

  return (
    <form
      onSubmit={(e) => {
        setIsLoading(true);
        onSubmit ? onSubmit(e, form) : formSubmitHandler(e, form);
      }}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-row gap-4">
        <div className="flex flex-col w-full gap-1">
          <label htmlFor="nama">Nama*</label>
          <TextField
            required
            type="text"
            name="name"
            id="nama"
            variant="outlined"
            size="small"
            value={form.name}
            onChange={formSetHandler}
          />
        </div>
        <div className="flex flex-col w-full gap-1">
          <div className="flex flex-row items-center justify-between w-full gap-2">
            <label htmlFor="email">Email* </label>
            {error.type === "email" && <label className="text-xs text-red-500 font-bold">{error.details}</label>}
          </div>
          <TextField
            required
            id="email"
            type="email"
            variant="outlined"
            size="small"
            name="email"
            value={form.email}
            error={error.type === "email"}
            onChange={formSetHandler}
          />
        </div>
      </div>
      <div className="flex flex-row gap-4">
        <div className="flex flex-col w-full gap-1">
          <label htmlFor="NIP">NIP*</label>
          <TextField
            required
            type="text"
            name="NIP"
            id="NIP"
            variant="outlined"
            size="small"
            value={form.NIP}
            onChange={formSetHandler}
            inputProps={{
              minLength: 18,
            }}
          />
        </div>
        <div className="flex flex-col w-full gap-1">
          <label>Gender*</label>
          <Select
            required
            value={form.gender}
            size="small"
            onChange={genderSelectHandler}
          >
            {["L", "P"].map((gender) => (
              <MenuItem key={gender} value={gender}>
                {gender}
              </MenuItem>
            ))}
          </Select>
        </div>
      </div>
      <div className="flex flex-row gap-4">
        <div className="flex flex-col w-full gap-1">
          <label>Jabatan*</label>
          <Select
            required
            value={form.jabatan}
            size="small"
            onChange={jabatanSelectHandler}
          >
            {["Petugas", "Penjaga"].map((jabatan) => (
              <MenuItem key={jabatan} value={jabatan}>
                {jabatan}
              </MenuItem>
            ))}
          </Select>
        </div>
        <div className="flex flex-col w-full gap-1">
          <label>Roles*</label>
          <Select
            required
            value={`${roles.length > 0 ? form.roleId : ""}`}
            size="small"
            onChange={(e: SelectChangeEvent) => {
              setForm((prev) => ({
                ...prev,
                roleId: Number(e.target.value),
              }));
            }}
          >
            {roles.map((role) => (
              <MenuItem key={role.id} value={role.id}>
                {role.name}
              </MenuItem>
            ))}
          </Select>
        </div>
      </div>
      <div className="flex flex-row gap-4">
        <div className="flex flex-col w-full gap-1">
          <label htmlFor="password">Password*</label>
          <TextField
            required
            id="password"
            type="password"
            variant="outlined"
            size="small"
            name="password"
            onChange={formSetHandler}
            inputProps={{
              minLength: 8,
            }}
          />
        </div>
        <div className="flex flex-col w-full gap-1">
          <label htmlFor="passwordConfirmation">Konfirmasi Password*</label>
          <TextField
            required
            id="passwordConfirmation"
            type="password"
            variant="outlined"
            size="small"
            name="confirm_password"
            onChange={formSetHandler}
            error={form.password !== form.confirm_password}
            inputProps={{
              minLength: 8,
            }}
          />
        </div>
      </div>
      <div className="flex flex-row w-full gap-4 items-center">
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          className="flex-grow"
          disabled={form.password !== form.confirm_password || isLoading}
        >
          Tambah
        </Button>
        <div className={`${!isLoading && "hidden"} flex`}>
          <ClipLoader color="#1976d2" />
        </div>
      </div>
    </form>
  );
};

export default UserForm;
