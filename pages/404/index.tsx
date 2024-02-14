import React from 'react';
import PageWithLayoutType from 'types/layoutPages';
import DefaultLayout from 'layouts/defaultLayout';

import Error404 from 'components/errors/Error404';

const Page404: React.FC = () => <Error404 />;
(Page404 as PageWithLayoutType).layout = DefaultLayout;

export default Page404;
