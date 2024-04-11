import axios from "axios";

// const globalUrl = "http://localhost:8080/api/";
const globalUrl = "http://localhost/api/";

export const getAllTugas = (callback) => {
  axios
    .get(`${globalUrl}list`)
    .then((res) => {
      callback(true, res);
    })
    .catch((err) => {
      callback(false, err), console.log(err);
    });
};

export const simpanTugas = (datasend, callback) => {
  axios
    .post(`${globalUrl}simpan`, datasend)
    .then((res) => {
      callback(true, res);
    })
    .catch((err) => {
      callback(false, err), console.log(err);
    });
};

export const ubahTugas = (id, callback) => {
  axios
    .get(`${globalUrl}listid/${id}`)
    .then((res) => {
      callback(true, res);
    })
    .catch((err) => {
      callback(false, err), console.log(err);
    });
};

export const updateTugas = (datasend, callback) => {
  axios
    .post(`${globalUrl}ubah`, datasend)
    .then((res) => {
      callback(true, res);
    })
    .catch((err) => {
      callback(false, err), console.log(err);
    });
};

export const statusUpdate = (datasend, callback) => {
  axios
    .post(`${globalUrl}update-status`, datasend)
    .then((res) => {
      callback(true, res);
    })
    .catch((err) => {
      callback(false, err), console.log(err);
    });
};

export const deleteTugas = (id, callback) => {
  axios
    .get(`${globalUrl}hapus/${id}`)
    .then((res) => {
      callback(true, res);
    })
    .catch((err) => {
      callback(false, err), console.log(err);
    });
};

export const cariTugas = (datasend, callback) => {
  axios
    .post(`${globalUrl}cari-tugas`, datasend)
    .then((res) => {
      callback(true, res);
    })
    .catch((err) => {
      callback(false, err), console.log(err);
    });
};
