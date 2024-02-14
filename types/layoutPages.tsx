import { NextPage } from 'next';
import GeneralLayout from '../layouts/generalLayout';
import AuthLayout from '../layouts/authLayout';

type PageWithGeneralLayoutType = NextPage & { layout: typeof GeneralLayout };
type PageWithAuthLayoutType = NextPage & { layout: typeof AuthLayout };

type PageWithLayoutType = PageWithGeneralLayoutType | PageWithAuthLayoutType;

export default PageWithLayoutType;
