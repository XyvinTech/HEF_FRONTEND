import {
  Typography,
  Dialog,
  DialogContent,
  Stack,
  DialogTitle,
  Box,
  Divider,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { ReactComponent as CloseIcon } from "../../assets/icons/CloseIcon.svg";
import { StyledButton } from "../../ui/StyledButton";
import { useNewsStore } from "../../store/newsStore";
import { useState } from "react";
import { useAdminStore } from "../../store/adminStore";

const NewsPreview = ({ open, onClose, onChange, data, onEdit }) => {
  const { handleSubmit } = useForm();
  const { updateNews } = useNewsStore();
  const [loading, setLoading] = useState(false);
  const { singleAdmin } = useAdminStore();
  const onSubmit = async () => {
    setLoading(true);
    try {
      const formData = {
        category: data.category,
        title: data.title,
        media: data.media,
        content: data.content,
      };
      if (data.status === "published") {
        formData.status = "unpublished";
      } else {
        formData.status = "published";
      }
      await updateNews(data?._id, formData);
      onChange();
    } catch (error) {
      console.error("Error updating news:", error);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  const handleClear = (event) => {
    event.preventDefault();
    onClose();
  };
  const handleEdit = (event) => {
    event.preventDefault();
    onEdit();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      PaperProps={{
        sx: { borderRadius: "12px" },
      }}
    >
      {" "}
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle sx={{ height: "auto", padding: 3 }}>
          <Box display="flex" justifyContent="end" alignItems="center">
            <Typography
              onClick={(event) => handleClear(event)}
              color="#E71D36"
              style={{ cursor: "pointer" }}
            >
              <CloseIcon />
            </Typography>
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ height: "auto", padding: 0 }}>
          <Stack spacing={2} padding={2} justifyContent={"center"}>
            <Box display="flex" justifyContent="center">
              <img src={data?.media} width={"461px"} height={"262px"} />
            </Box>

            <Typography variant="h5" color={"textTertiary"}>
              {data?.title}
            </Typography>
            <Typography variant="h7" color={"textSecondary"}>
              {data?.category}
            </Typography>
            <Typography variant="h7" color={"textSecondary"}>
              {data?.content}
            </Typography>
          </Stack>{" "}
        </DialogContent>
        {singleAdmin?.role?.permissions?.includes("newsManagement_modify") && (
          <Stack
            direction={"row"}
            spacing={2}
            padding={2}
            justifyContent={"end"}
          >
            <StyledButton
              variant="secondary"
              name="Edit"
              onClick={(event) => handleEdit(event)}
              disabled={loading}
            />
            <StyledButton
              variant="primary"
              name={data?.status === "published" ? "Unpublish" : "Publish"}
              type="submit"
              disabled={loading}
            />
          </Stack>
        )}
      </form>
    </Dialog>
  );
};

export default NewsPreview;
