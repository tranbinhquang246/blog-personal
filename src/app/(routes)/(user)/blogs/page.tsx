'use client';
import Image from 'next/image';
import { defaultImage } from 'public/images';
import React, { useContext, useEffect, useState } from 'react';
import { format } from 'date-fns';

import api from '@app/_base/api';
import Button from '@app/_components/common/Button';
import { apiRouters, pageRouter } from '@app/_constants/routers';
import { LoadingContext } from '@app/_context/loading';
import { CreationData, Post } from '@app/_interfaces/post';
import { useQuery } from '@tanstack/react-query';
import { FORMAT_DATE_USER } from '@app/_constants';
import Link from 'next/link';
import Select from '@app/_components/common/Select';
import { OptionType } from '@app/_interfaces';

const Blogs = () => {
  const { setIsLoading } = useContext(LoadingContext);
  const [data, setData] = useState<Post[]>([]);
  const [categoryOption, setCategoryOption] = useState<OptionType[]>([
    { label: 'All', value: '' },
  ]);

  // GET CREATION DATA
  const getCreationData = async () => {
    return await api.get<CreationData>(apiRouters.CREATION_POST_DATA);
  };

  const { data: listCreationData } = useQuery({
    enabled: true,
    refetchOnMount: true,
    queryKey: ['getCreationData'],
    queryFn: getCreationData,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (listCreationData?.data) {
      setCategoryOption([
        ...categoryOption,
        ...listCreationData.data.category.map((element) => ({
          value: element.id,
          label: element.name,
        })),
      ]);
    }
  }, [listCreationData]);

  // GET POST
  const getPosts = async () => {
    setIsLoading(true);
    return await api.get<Post[]>(`${apiRouters.POST_LIST}`);
  };

  const { data: listPosts, isFetched: isFetchedListPosts } = useQuery({
    enabled: true,
    refetchOnMount: true,
    queryKey: ['getListPosts'],
    queryFn: getPosts,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (isFetchedListPosts) {
      setIsLoading(false);
    }
  }, [isFetchedListPosts]);

  useEffect(() => {
    if (listPosts) {
      setData(listPosts.data);
    }
  }, [listPosts]);

  const onChangeFilter = () => {};

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-col sm:flex-row items-center bg-lavender p-10 xs:p-20 gap-5">
        <div className="flex flex-col gap-3 w-full sm:w-1/2 ">
          <p className="font-secondary tracking-[5px]">FEATURED POST</p>
          <p className="text-2xl font-bold">{data[0]?.title}</p>
          <p className="font-light text-xs">
            By {data[0]?.user.email} |{' '}
            {data[0]?.createdAt &&
              format(new Date(data[0].createdAt), FORMAT_DATE_USER)}
          </p>
          <p className="text-sm">
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident.
          </p>
          <Button className="w-[120px] p-2 bg-yellow text-black border-none rounded-none font-normal text-sm hover:bg-yellow hover:w-[150px] transition-all duration-500">
            {'Read more'}
          </Button>
        </div>
        <Image
          src={defaultImage}
          alt="default"
          width={515}
          height={360}
          className="w-full sm:w-1/2 min-h-[280px]"
        />
      </div>
      <div className="flex flex-col p-10 xs:p-20 gap-5">
        <div className="flex w-full justify-between">
          <p className="font-bold text-2xl">All post</p>
          <div>
            <Select
              className="h-10 w-48"
              options={categoryOption}
              defaultOption={categoryOption[0]}
              onSelectedOptionChange={onChangeFilter}
            />
          </div>
        </div>
        <hr />
        <div className="flex flex-col justify-center gap-10">
          {data.map((element, index) => {
            return (
              <Link
                href={pageRouter.BLOG_DETAIL(element.id)}
                key={index}
                className="flex gap-5 hover:scale-105 transition-all duration-300">
                <Image
                  src={defaultImage}
                  alt="default"
                  width={490}
                  height={318}
                  className="w-2/5"
                />
                <div className="flex flex-col justify-center gap-5 w-3/5">
                  <p className="text-purple tracking-widest">
                    {element.category[0].category.name}
                  </p>
                  <p className="font-semibold text-2xl truncate">
                    {element.title}
                  </p>
                  <p className="font-light">
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident.
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
        {/* <div className="flex w-full justify-center gap-5">
          <Button className="border-none w-28 h-10">
            <Image alt="Previous" src={DownIcon} className="rotate-90" />
            Previous
          </Button>
          <Button className="border-none w-28 h-10 ">
            Next <Image alt="Previous" src={DownIcon} className="-rotate-90" />
          </Button>
        </div> */}
      </div>
    </div>
  );
};

export default Blogs;
