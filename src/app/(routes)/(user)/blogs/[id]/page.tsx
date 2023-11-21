'use client';

import { useContext, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';

import api from '@app/_base/api';
import { apiRouters } from '@app/_constants/routers';
import { LoadingContext } from '@app/_context/loading';
import { Post } from '@app/_interfaces/post';
import { DefaultUserIcon } from 'public/icons';
import { format } from 'date-fns';
import { FORMAT_DATE_USER } from '@app/_constants';

const BlogsDetail = ({ params }: { params: { id: string } }) => {
  const { setIsLoading } = useContext(LoadingContext);
  const [data, setData] = useState<Post>();

  // GET POST
  const getPost = async () => {
    setIsLoading(true);
    return await api.get<Post>(`${apiRouters.POST_DETAIL(params.id)}`);
  };

  const {
    data: Post,
    refetch: refetchPost,
    isFetched: isFetchedPost,
  } = useQuery({
    enabled: false,
    refetchOnMount: false,
    queryKey: ['getPost'],
    queryFn: getPost,
    staleTime: Infinity,
  });

  useEffect(() => {
    refetchPost();
  }, []);

  useEffect(() => {
    if (isFetchedPost) {
      setIsLoading(false);
    }
  }, [isFetchedPost]);

  useEffect(() => {
    if (Post) {
      setData(Post.data);
    }
  }, [Post]);

  return (
    <div className="flex flex-col max-w-[1280px] px-10 py-5 xs:px-20 xs:py-10 gap-14 w-full">
      <div className="flex gap-2">
        <Image
          alt="user post"
          src={data?.user.profile.avatar || DefaultUserIcon}
          width={64}
          height={64}
          className="h-12 w-12 rounded-full"
        />
        <div className="flex flex-col justify-center">
          <p className="text-purple font-bold">{`${
            data?.user?.profile?.firstName
              ? data?.user.profile.firstName +
                (data?.user.profile.lastName
                  ? ' ' + data?.user.profile.lastName
                  : '')
              : data?.user?.profile?.lastName
              ? data?.user.email
              : data?.user?.email
              ? data?.user.email
              : ''
          }`}</p>
          <p className="font-light text-xs">
            {data?.createdAt &&
              `Posted on ${format(new Date(data.createdAt), FORMAT_DATE_USER)}`}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="font-bold text-3xl">{data?.title}</p>
        <p className="text-purple text-sm font-semibold">
          {data?.category[0].category.name}
        </p>
      </div>
      {data?.content && (
        <div
          className=""
          dangerouslySetInnerHTML={{ __html: data.content }}></div>
      )}
      {data?.tag && (
        <div className="flex gap-2 items-center">
          Tags:
          {data.tag.map((element, index) => {
            return (
              <p
                className="bg-yellow py-1 px-3 font-light rounded-lg"
                key={index}>
                {element.tag.name}
              </p>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BlogsDetail;
