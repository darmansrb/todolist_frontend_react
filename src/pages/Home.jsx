import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  cariTugas,
  deleteTugas,
  getAllTugas,
  statusUpdate,
} from "../services/todolist.service";
import Swal from "sweetalert2";

const Home = () => {
  const [todolists, setTodoList] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const toastMixin = Swal.mixin({
    toast: true,
    icon: "success",
    title: "Custom title",
    animation: false,
    position: "top-right",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  const handleLoadingSwalrt = (pesan) => {
    Swal.fire({
      title: pesan,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  };

  //ambil data saat buka home
  useEffect(() => {
    const pesanload = "Mengambil data";
    handleLoadingSwalrt(pesanload);
    getAllTugas((status, res) => {
      if (status) {
        setTodoList(res.data.data);
        Swal.close();
      } else {
        Swal.fire({
          title: "Error Koneksi",
          text: "Koneksi Server backend terputus",
          icon: "error",
        });
      }
    });
  }, []);

  //hapus data by id
  const handleDelete = (id, judul) => {
    Swal.fire({
      title: `Hapus ${judul} ?`,
      text: "Anda akan kehilangan data ini",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak",
    }).then((result) => {
      if (result.isConfirmed) {
        const pesanload = "Menghapus data";
        handleLoadingSwalrt(pesanload);

        deleteTugas(id, (status, res) => {
          if (status) {
            if (res.data.status_kode === 201) {
              toastMixin.fire({
                animation: true,
                title: res.data.pesan,
              });
              //refresh ambil data baru
              getAllTugas((status, res) => {
                setTodoList(res.data.data);
              });
            } else {
              toastMixin.fire({
                icon: "warning",
                animation: true,
                title: res.data.pesan,
              });
            }
          } else {
            Swal.fire({
              title: "Error Koneksi",
              text: "Koneksi Server backend terputus",
              icon: "error",
            });
          }
        });
      }
    });
  };

  // update status by id
  const handleUpdateStatus = (id, status) => {
    const pesanload = "Mengupdate status";
    handleLoadingSwalrt(pesanload);

    var reversestatus = "";
    if (status == 1) {
      reversestatus = "cancel";
    } else {
      reversestatus = "done";
    }

    const datapost = {
      id: id,
      status: reversestatus,
    };

    statusUpdate(datapost, (status, res) => {
      Swal.close();
      if (status) {
        if (res.data.status_kode === 201) {
          //refresh ambil data baru
          getAllTugas((status, res) => {
            setTodoList(res.data.data);
          });
          toastMixin.fire({
            animation: true,
            title: res.data.pesan,
          });
        } else {
          toastMixin.fire({
            icon: "warning",
            animation: true,
            title: res.data.pesan,
          });
        }
      } else {
        Swal.fire({
          title: "Error Koneksi",
          text: "Koneksi Server backend terputus",
          icon: "error",
        });
      }
    });
  };

  const handleCariTugas = (nama) => {
    setLoadingSearch(true);

    const reqcari = {
      request: nama,
    };

    cariTugas(reqcari, (status, res) => {
      if (status) {
        setLoadingSearch(false);
        setTodoList(res.data.data);
        Swal.close();
      } else {
        setLoadingSearch(false);
        Swal.fire({
          title: "Error Koneksi",
          text: "Koneksi Server backend terputus",
          icon: "error",
        });
      }
    });
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center bg-light vh-100">
      <h1>Daftar Tugas</h1>
      <div className="w-75 rounded bg-white border shadow p-4">
        <div className="row mb-3">
          <div
            className="col float-start input-group input-group-sm"
            style={{ width: "50%" }}
          >
            <span className="input-group-text" style={{ width: "12%" }}>
              {loadingSearch && (
                <div
                  className="spinner-border text-primary spinner-border-sm"
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              )}
            </span>
            <input
              type="text"
              className="form-control input-group-sm"
              id="tugasbaru"
              name="judul"
              aria-describedby="emailHelp"
              placeholder="Cari tugas"
              autoComplete="off"
              onChange={(e) => handleCariTugas(e.target.value)}
            ></input>
          </div>
          <div className="col d-flex justify-content-end">
            <Link to="add" className="btn btn-sm btn-success">
              Tambah Tugas
            </Link>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table border table-hover">
            <thead>
              <tr className="text-center">
                <th>#</th>
                <th>Tugas</th>
                <th>Status Kerja</th>
                <th>Tanggal Buat</th>
                <th>Tanggal Ubah</th>
                <th>Aksi</th>
              </tr>
            </thead>

            {todolists.length > 0 ? (
              // jika ada data
              <tbody>
                {todolists.map((itemtodo) => (
                  <tr key={itemtodo.id} className="text-center">
                    <td>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="statustodo"
                        id="statustodo"
                        defaultChecked={itemtodo.status == 1 ? true : false}
                        onChange={() =>
                          handleUpdateStatus(itemtodo.id, itemtodo.status)
                        }
                      />
                    </td>
                    <td>{itemtodo.judul}</td>
                    <td>{itemtodo.status == 0 ? "Belum" : "Selesai"}</td>
                    <td>
                      {new Date(itemtodo.created_at).toLocaleString("en-GB")}
                    </td>
                    <td>
                      {new Date(itemtodo.updated_at).toLocaleString("en-GB")}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-info ms-3"
                        disabled={itemtodo.status == 1 ? true : false}
                      >
                        <Link
                          to={`edit/${itemtodo.id}`}
                          type="button"
                          className="text-white"
                          style={{ textDecorationLine: "none" }}
                        >
                          Ubah
                        </Link>
                      </button>
                      <button
                        onClick={() =>
                          handleDelete(itemtodo.id, itemtodo.judul)
                        }
                        className="btn btn-sm btn-danger ms-3"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              // jika tidak ada data
              <tbody>
                <tr>
                  <td colSpan={6} className="text-center">
                    <h3>TIDAK ADA DATA</h3>
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};

export default Home;
