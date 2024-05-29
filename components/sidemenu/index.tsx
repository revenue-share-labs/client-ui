import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
    Box, Menu, NavLink,
} from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';

import {
    IoCaretForward, IoDocumentText,
    IoFolderOpen, IoPeopleCircle,
} from 'react-icons/io5';

import xlaLogo from 'public/images/XLA_logo.svg';
import logout from 'public/icons/log-out.svg';

import { useSignOut } from 'utils/hooks/useSignOut';
import folder from 'public/icons/folder-open.svg';
import styles from './index.module.scss';

function SideMenu() {
    const router = useRouter();
    const signOut = useSignOut();

    const [active, setActive] = useState(0);

    useEffect(() => {
        if (router.query && router.query.type) {
            const { type, status } = router.query;
            if (type === 'my') {
                setActive(status === 'drafts' ? 2 : 1);
            }
        }
    }, [router.query]);

    const openLink = (path: string, id: any) => {
        setActive(id);
        router.push(path);
    };

    return (
        <div className={styles.sideMenu}>
            <div className={styles.logo}>
                Contracts
            </div>
            <div className={styles.divider} />
            <div className={styles.leftMenu}>
                <Box sx={{ width: 228 }}>
                    <NavLink
                        label="My contracts"
                        rightSection={<IoCaretForward />}
                        defaultOpened
                        icon={(
                            <div className={styles.icon}>
                                <Image alt="folder open icon" src={folder.src} width={16} height={16} />
                            </div>
                        )}
                        variant="subtle"
                        classNames={{ root: styles.navLinkRoot, label: styles.label, children: styles.linkChild }}
                    >
                        <NavLink
                            label="Published"
                            active={active === 1}
                            onClick={() => openLink('/contracts?type=my&status=published', 1)}
                            color="#3E4FEA"
                            variant="filled"
                            classNames={{
                                root: `${styles.navLinkRoot} ${styles.navLinkChild}`,
                                label: `${active === 1 ? styles.labelChild : styles.labelChild_notSelected}`,
                            }}
                        />
                        <NavLink
                            label="Drafts"
                            active={active === 2}
                            onClick={() => openLink('/contracts?type=my&status=drafts', 2)}
                            color="#3E4FEA"
                            variant="filled"
                            classNames={{
                                root: `${styles.navLinkRoot} ${styles.navLinkChild}`,
                                label: `${active === 2 ? styles.labelChild : styles.labelChild_notSelected}`,
                            }}
                        />
                    </NavLink>

                    <NavLink
                        label="Community"
                        // rightSection={<IoCaretForward />}
                        childrenOffset={28}
                        active={active === 6}
                        onClick={() => openLink('/contracts?type=community', 6)}
                        icon={<IoPeopleCircle className={styles.icon} />}
                        variant="subtle"
                        classNames={{ root: styles.navLinkRoot, label: styles.label, children: styles.linkChild }}
                    />

                    {/* TODO: was hidden according EXLP-643 */}
                    {/* <NavLink */}
                    {/*    label="Documentation" */}
                    {/*    active={active === 9} */}
                    {/*    onClick={() => setActive(9)} */}
                    {/*    icon={<IoDocumentText className={styles.icon} />} */}
                    {/*    variant="subtle" */}
                    {/*    classNames={{ root: styles.navlinkRoot }} */}
                    {/* /> */}

                    {/* TODO: was hidden according EXLP-643 */}
                    {/* <NavLink */}
                    {/*    label="Info" */}
                    {/*    active={active === 10} */}
                    {/*    onClick={() => setActive(10)} */}
                    {/*    icon={<IoInformationCircle className={styles.icon} />} */}
                    {/*    variant="subtle" */}
                    {/*    classNames={{ root: styles.navlinkRoot }} */}
                    {/* /> */}
                </Box>
            </div>

            <div className={styles.grow}>&nbsp;</div>

            <div className={styles.accountBottom}>
                {/* <Image src={avatar.src} alt="XLA" width={40} height={40} /> */}
                {/* <div className={styles.name}> */}
                {/*    John Smith */}
                {/*    <span>creator</span> */}
                {/* </div> */}

                <Menu position="top-end">
                    <Menu.Target>
                        <div className={styles.logoutBtn}>
                            <Image src={logout.src} alt="XLA" width={16} height={16} />
                        </div>
                    </Menu.Target>

                    <Menu.Dropdown className={styles.menuDropdown}>
                        <Menu.Item
                            component="a"
                            onClick={signOut}
                            className={styles.menuItem}
                        >
                            <div className={styles.itemInside}>
                                Sign out
                                <Image src={logout.src} alt="Sign-out icon" width={24} height={24} />
                            </div>
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </div>
        </div>
    );
}

export default observer(SideMenu);
