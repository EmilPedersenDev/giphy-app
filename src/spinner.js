let spinner = document.querySelector(".spinner");

export default function showSpinner(isFetching, showOnscrollSpinner) {
  if (!isFetching) {
    spinner.classList.remove("reload");
    spinner.classList.remove("infinite-scroll");
    return;
  }

  if (isFetching && !showOnscrollSpinner) {
    spinner.classList.remove("infinite-scroll");
    spinner.classList.add("reload");
    return;
  }
  spinner.classList.remove("reload");
  spinner.classList.add("infinite-scroll");
}
