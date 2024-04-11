import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
import { simpanTugas } from "../services/todolist.service";
import Swal from "sweetalert2";

const Create = () => {
  const [values, setValues] = useState({
    judul: "",
  });

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (values.judul === "") {
      Swal.fire({
        title: "Tugas tidak boleh kosong",
        icon: "warning",
      });
    } else {
      Swal.fire({
        title: "Menyimpan data",
        didOpen: () => {
          Swal.showLoading();
        },
      });

      simpanTugas(values, (status, res) => {
        Swal.close();
        if (status) {
          if (res.data.status_kode === 201) {
            Swal.fire({
              title: res.data.pesan,
              text: "Ingin kembali ke halaman utama?",
              icon: "success",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Ya",
              cancelButtonText: "Tidak",
            }).then((result) => {
              if (result.isConfirmed) {
                navigate("/");
              }
            });
          } else {
            Swal.fire({
              title: res.data.pesan,
              icon: "warning",
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
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center bg-light vh-100">
      <h1>Tambah Tugas Baru</h1>
      <div className="w-50 rounded bg-white border shadow p-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <div className="row">
              <label htmlFor="tugasbaru" className="form-label col">
                Tugas{" "}
              </label>
            </div>

            <input
              type="text"
              className="form-control"
              id="tugasbaru"
              name="judul"
              aria-describedby="emailHelp"
              placeholder="Masukan tugas"
              autoComplete="off"
              onChange={(event) =>
                setValues({ ...values, judul: event.target.value })
              }
            ></input>
          </div>
          <button type="submit" className="btn btn-primary">
            Simpan
          </button>
          <Link to="/" className="btn btn-warning ms-3">
            Kembali
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Create;
