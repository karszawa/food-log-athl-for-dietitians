import React, { useEffect, useState } from "react";
import { Image, ImageProps, View } from "react-native";
import { get } from "lodash-es";
import dayjs from "dayjs";
import { FooLogAPIClient } from "../lib/foolog-api-client";
import { Photo } from "../lib/foolog-api-client-types";

interface Props extends ImageProps {
  athleteId: string;
  photo: Photo;
}

const usePhoto = ({
  athleteId,
  photo: originalPhoto,
}: {
  athleteId: string;
  photo: Photo;
}) => {
  const [photo, setPhoto] = useState(originalPhoto);

  useEffect(() => {
    if (
      !photo.file /* ファイルが存在しないか */ ||
      dayjs(get(photo, "file.expiry")) < dayjs() /* 有効期限が過去 */
    ) {
      // fetch and setPhoto
      FooLogAPIClient.getRecordsPhotosIdSign({
        athleteId,
        id: photo.id,
        size: "S",
      })
        .then(({ url, expiry }) => {
          setPhoto({
            ...photo,
            file: {
              url,
              expiry,
            },
          });
        })
        .catch(e => {
          // 404 Not Found
          console.error(e);
        });
    }
  }, [photo, setPhoto]);

  return {
    photoIsValid: photo.file && dayjs(photo.file.expiry) > dayjs(),
    photo,
  };
};

export const AuthImage = ({
  photo: originalPhoto,
  athleteId,
  ...rest
}: Props) => {
  const { photoIsValid, photo } = usePhoto({ athleteId, photo: originalPhoto });

  return photoIsValid ? (
    <Image {...rest} source={{ uri: photo.file.url }} />
  ) : (
      <View {...rest} />
    );
};
