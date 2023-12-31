import React, { useContext, useEffect, useMemo } from "react";
import LinkHighlightContext from "../../../contexts/LinkHighlightContext";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { UserModel } from "../../../types/Auth.type";
import { getUsers } from "../../../utils/api";
import { Link, useLocation } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Box, Button } from "@mui/material";
import DashboardLoading from "../components/DashboardLoading";

const UserList = () => {
  const { setCurrentPath } = useContext(LinkHighlightContext);
  const [users, setUsers] = React.useState<UserModel[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const location = useLocation();

  const fetchUsers = () => {
    getUsers()
      .then((res) => {
        setUsers(res.data.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
    setIsLoading(false);
  };

  useEffect(() => {
    if (location.state) {
      if (location.state.deleteUser) {
        toast.info(`User berhasil dihapus!`, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else if (location.state.approveUser) {
        toast.info(`User berhasil diapprove!`, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
      window.history.replaceState(null, "");
    }
  }, []);

  useEffect(() => {
    setCurrentPath("users");
    fetchUsers();
    return () => {
      setCurrentPath("");
    };
  }, []);

  const dataColumns = useMemo<MRT_ColumnDef<UserModel>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Nama",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "jabatan",
        header: "Jabatan",
        size: 50,
      },
      {
        accessorKey: "approved",
        header: "Approved",
        size: 50,
        Cell: ({ row }) => (
          <Box>{row.original.approved ? "Approved" : "-"}</Box>
        ),
      },
      {
        accessorKey: "disabled",
        header: "Disabled",
        size: 50,
        Cell: ({ row }) => (
          <Box>{row.original.disabled ? "Disabled" : "-"}</Box>
        ),
      },
    ],
    [users]
  );

  const table = useMaterialReactTable({
    columns: dataColumns,
    data: users,
    enableRowActions: true,
    positionActionsColumn: "last",
    renderRowActions: ({ row }) => (
      <Link
        to={`/dashboard/users/${row.original.id}`}
        className="px-2 bg-primary-main text-center text-primary-contrast rounded-lg inline-flex items-center justify-center"
      >
        <Button startIcon={<VisibilityIcon />} sx={{ color: "white" }}>
          <p>Lihat</p>
        </Button>
      </Link>
    ),
  });

  if (isLoading) {
    return <DashboardLoading />;
  }

  return (
    <HelmetProvider>
      <Helmet>
        <title>Daftar User - LapasPanic</title>
      </Helmet>
      <ToastContainer />
      <div className="p-4 bg-white bg-opacity-50 shadow-xl border rounded-lg">
        <h1 className="text-2xl font-bold mb-2">Daftar Pengguna</h1>
        <div className="rounded-lg">
          <MaterialReactTable table={table} />
        </div>
      </div>
    </HelmetProvider>
  );
};

export default UserList;
