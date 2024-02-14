import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

import filterIcon from 'public/icons/filter.svg';
import close from 'public/icons/close.svg';

import { FILTER_BY_RECIPIENTS, FILTER_BY_TYPES, FILTER_BY_VISIBILITY } from 'constants/filterParam';
import { observer } from 'mobx-react-lite';

import { useOnClickOutside } from 'utils/hooks/useOnClickOutside';
import { ParticipantStatus } from 'types/common/ParticipantStatus';
import { VisibilityType } from 'types/contract/VisibilityType';
import { useRouter } from 'next/router';
import { useSearchStore } from 'stores/SearchStore';
import CustomButton from '../button/CustomButton';
import styles from './FilterBlock.module.scss';

type FilterAreaProps = {
    setIsPrepareSearchParams: (value: boolean) => void;
};

function FilterArea({ setIsPrepareSearchParams }: FilterAreaProps) {
    const searchStore = useSearchStore();
    const router = useRouter();

    const [isFilterArea, setIsFilterArea] = useState(false);

    const [queryTypes, setQueryTypes] = useState<any[]>([]);
    const [queryVisible, setQueryVisible] = useState<any[]>([]);
    const [queryRecipients, setQueryRecipients] = useState<any[]>([]);

    const [querySelected, updateQuerySelected] = useState<number>(0);

    const filterRef = useRef<HTMLDivElement | null>(null);
    // Call hook passing in the ref and a function to call on outside click
    useOnClickOutside(filterRef, () => onClose());

    const updateFilter = () => {
        setIsFilterArea(!isFilterArea);
    };

    const findParticipant = (type: string) => {
        setIsPrepareSearchParams(true);
        if (type === ParticipantStatus.OWNER) {
            searchStore.toggleIsFilterByOwner();
        } else {
            searchStore.toggleIsFilterByRecipient();
        }
    };

    // trigger when we click Reset Filters on the previewCards
    useEffect(() => {
        if (searchStore.isDataCleared) {
            (async () => {
                onClear();
            })().then(() => {
                searchStore.setIsDataCleared(false);
            });
        }
    }, [searchStore.isDataCleared]);

    useEffect(() => {
        resetMainFilterParams();
    }, [router]);

    useEffect(() => {
        (async () => {
            const searchAttributes = searchStore.getSearchParams();
            const participantStatus = [];
            if ((searchStore.isFilterByOwner && searchStore.isFilterByRecipient)) {
                participantStatus.push(ParticipantStatus.OWNER, ParticipantStatus.RECIPIENT);
            }
            if (!searchStore.isFilterByOwner && searchStore.isFilterByRecipient) {
                participantStatus.push(ParticipantStatus.RECIPIENT);
            }
            if (searchStore.isFilterByOwner && !searchStore.isFilterByRecipient) {
                participantStatus.push(ParticipantStatus.OWNER, ParticipantStatus.AUTHOR);
            }
            if (searchStore.isMy && !searchStore.isFilterByRecipient && !searchStore.isFilterByOwner) {
                participantStatus.push(
                    ParticipantStatus.AUTHOR,
                    ParticipantStatus.OWNER,
                    ParticipantStatus.RECIPIENT,
                    ParticipantStatus.CONTROLLER,
                );
            }
            searchAttributes.participantStatus = participantStatus;
            searchStore.setSearchParams(searchAttributes);
        })().then(() => {
            setIsPrepareSearchParams(false);
        });
    }, [searchStore.isFilterByOwner, searchStore.isFilterByRecipient]);

    const onClose = () => {
        setIsFilterArea(false);
    };

    const onClear = () => {
        (async () => {
            setIsPrepareSearchParams(true);
            resetMainFilterParams();

            const searchParams = searchStore.isMy ? {
                participantStatus: [ParticipantStatus.AUTHOR,
                    ParticipantStatus.RECIPIENT,
                    ParticipantStatus.OWNER, ParticipantStatus.CONTROLLER],
            } : {
                visibility: [VisibilityType.COMMUNITY],
            };

            searchStore.setSearchParams(searchParams);

            searchStore.setIsFilterByOwner(false);
            searchStore.setIsFilterByRecipient(false);
        })().then(() => {
            setIsPrepareSearchParams(false);
        });
    };

    const resetMainFilter = () => {
        (async () => {
            resetMainFilterParams();

            const searchParams = searchStore.getSearchParams();
            const {
                visibility, type, recipientsStatus, ...newSearchParams
            } = searchParams;
            searchStore.setSearchParams(newSearchParams);
        })().then(() => {
            setIsPrepareSearchParams(false);
        });
    };

    const resetMainFilterParams = () => {
        setIsFilterArea(false);
        setQueryTypes([]);
        setQueryVisible([]);
        setQueryRecipients([]);
        updateQuerySelected(0);
    };

    const selectButton = (value: string, query: string) => {
        if (query === 'type') {
            if (queryTypes.includes(value)) {
                setQueryTypes((prevState) => prevState.filter((existing) => existing !== value));
            } else {
                setQueryTypes([...queryTypes, value]);
            }
        }

        if (query === 'visibility') {
            if (queryVisible.includes(value)) {
                setQueryVisible((prevState) => prevState.filter((existing) => existing !== value));
            } else {
                setQueryVisible([...queryVisible, value]);
            }
        }

        if (query === 'recipients') {
            if (queryRecipients.includes(value)) {
                setQueryRecipients((prevState) => prevState.filter((existing) => existing !== value));
            } else {
                setQueryRecipients([...queryRecipients, value]);
            }
        }
    };

    const sendRequest = () => {
        (async () => {
            setIsPrepareSearchParams(true);
            const searchAttributes = searchStore.getSearchParams();

            // for my contract, we need to count params visibility, recipientsStatus and type
            if (searchStore.isMy) {
                updateQuerySelected(queryTypes.length + queryVisible.length + queryRecipients.length);
                searchAttributes.visibility = queryVisible;
                searchAttributes.recipientsStatus = queryRecipients;
            } else {
                // for community contracts, we need to count param type
                updateQuerySelected(queryTypes.length);
            }

            searchAttributes.type = queryTypes;

            if (searchStore.isMy && !searchStore.isFilterByRecipient && !searchStore.isFilterByOwner) {
                if (!searchAttributes.participantStatus.includes(ParticipantStatus.AUTHOR)) {
                    searchAttributes.participantStatus = [
                        ...searchAttributes.participantStatus,
                        ParticipantStatus.AUTHOR,
                    ];
                }
            }
            searchStore.setSearchParams(searchAttributes);
            setIsFilterArea(false);
        })().then(() => {
            setIsPrepareSearchParams(false);
        });
    };

    return (
        <div className={styles.filtersBlock}>
            <div className={styles.filterMainBtn}>
                <CustomButton
                    name="Filters"
                    color={`${querySelected !== 0 ? 'violet' : 'black'}`}
                    style={{ height: 32, fontSize: 14 }}
                    radius={12}
                    leftIcon={
                        <Image src={filterIcon.src} alt="" width={20} height={20} />
                    }
                    onClick={updateFilter}
                    rightIcon={querySelected !== 0 && <div>{querySelected}</div>}
                />
            </div>

            {isFilterArea && (
                <div className={styles.filterArea} ref={filterRef}>
                    <div className={styles.filterTitle}>
                        <span>Filters</span>
                        <Image
                            src={close.src}
                            alt="Close btn"
                            width={12.75}
                            height={12.75}
                            onClick={onClose}
                        />
                    </div>

                    <div className={` ${styles.filterRow} ${styles.brdBottom}`}>
                        <div className={styles.title}>Type</div>
                        <div className={styles.btns}>
                            {FILTER_BY_TYPES.map((item) => (
                                <CustomButton
                                    name={item.label}
                                    radius={12}
                                    color={`${
                                        queryTypes.includes(item.value) ? 'violet' : 'black'
                                    }`}
                                    style={{ height: 32 }}
                                    onClick={() => selectButton(item.value, 'type')}
                                    key={`${item.label}`}
                                />
                            ))}
                        </div>
                    </div>
                    {searchStore.isMy && (
                        <div className={` ${styles.filterRow} ${styles.brdBottom}`}>
                            <div className={styles.title}>Visibility</div>
                            <div className={styles.btns}>
                                {FILTER_BY_VISIBILITY.map((item) => (
                                    <CustomButton
                                        name={item.label}
                                        radius={12}
                                        color={`${
                                            queryVisible.includes(item.value) ? 'violet' : 'black'
                                        }`}
                                        style={{ height: 32 }}
                                        onClick={() => selectButton(item.value, 'visibility')}
                                        key={`${item.label}`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                    {searchStore.isMy && (
                        <div className={styles.filterRow}>
                            <div className={styles.title}>Recipients</div>
                            <div className={styles.btns}>
                                {FILTER_BY_RECIPIENTS.map((item) => (
                                    <CustomButton
                                        name={item.label}
                                        radius={12}
                                        color={`${
                                            queryRecipients.includes(item.value) ? 'violet' : 'black'
                                        }`}
                                        style={{ height: 32 }}
                                        onClick={() => selectButton(item.value, 'recipients')}
                                        key={`${item.label}`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    <div className={styles.filterFooter}>
                        <CustomButton
                            name="Reset"
                            radius={12}
                            color="black"
                            style={{ height: 40, width: 100 }}
                            variant="outlined"
                            onClick={resetMainFilter}
                        />
                        <CustomButton
                            name="Apply"
                            radius={12}
                            color="blue"
                            style={{ height: 40, width: 100 }}
                            onClick={sendRequest}
                        />
                    </div>
                </div>
            )}

            {querySelected !== 0 && (
                <div className={styles.filterClear} onClick={onClear}>
                    Clear all
                </div>
            )}

            <div className={styles.filterDivider} />

            <div className={styles.filterOthers}>
                <CustomButton
                    name="Recipients"
                    color={`${searchStore.isFilterByRecipient ? 'violet' : 'black'}`}
                    style={{ height: 32, fontSize: 14 }}
                    radius={12}
                    onClick={() => findParticipant('RECIPIENT')}
                />

                <CustomButton
                    name="Owner"
                    color={`${searchStore.isFilterByOwner ? 'violet' : 'black'}`}
                    style={{ height: 32, fontSize: 14 }}
                    radius={12}
                    onClick={() => findParticipant('OWNER')}
                />
            </div>
        </div>
    );
}

export default observer(FilterArea);
